import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpStatusCode } from 'axios';
import { ACCEPTED_FILE_TYPES, MIME_TYPES_MAP } from './constants';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import {
  audioFileUploaParsePipe,
  fileInterceptorOptions,
} from './modules/multer';
import { PhraseService } from './phrase.service';

@ApiTags('audio')
@Controller('audio')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userID: {
          type: 'number',
        },
      },
    }
  })
  @ApiResponse({status: 200, description: 'Get list of all phrases created.'})
  create(@Body() createPrhaseDto: CreatePhraseDto) {
    return this.phraseService.create(createPrhaseDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get phrase by id.',
  })
  findOne(@Param('id') id: string) {
    return this.phraseService.findOne(+id);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: 'Delete phrase by id.',
  })
  async remove(@Param('id') id: string) {
    await this.phraseService.remove(+id);
  }

  @Post('user/:user_id/phrase/:phrase_id')
  @UseInterceptors(FileInterceptor('audio_file', fileInterceptorOptions()))
  @ApiOperation({
    summary: 'Upload audio file to the given user/phrase.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        audio_file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatusCode.NoContent,
    description: 'File was uploaded successfully.',
  })
  async uploadPhraseFile(
    @Param('user_id') userID: number,
    @Param('phrase_id') phraseID: number,
    @UploadedFile(audioFileUploaParsePipe())
    file: Express.Multer.File
  ) {
    await this.phraseService.transformAndUpdateAudioPhrase(
      phraseID,
      userID,
      file
    );
  }

  @Get('user/:user_id/phrase/:phrase_id/:audio_format')
  @ApiResponse({
    status: HttpStatusCode.Ok,
    description: 'Stream audio with the selected "audio_format".',
  })
  @ApiParam({
    name: 'audio_format',
    description: 'Accepted audio formats.',
    enum: ACCEPTED_FILE_TYPES,
  })
  async retrieveAudioByFormat(
    @Param('user_id') userID: number,
    @Param('phrase_id') phraseID: number,
    @Param('audio_format') format: string,
    @Res() res: Response
  ) {
    try {
      // Set header for the client to recognize the streamed data as audio.
      res.setHeader('Content-Type', MIME_TYPES_MAP[format] || null);
      // res.setHeader('Content-Disposition', `attachment; filename=audio-file.${format}`);
      await this.phraseService.streamAudioPhrase(phraseID, userID, format, res);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      Logger.error(error);
      throw new InternalServerErrorException(
        'Internal error prevented the streaming of the requested file.'
      );
    }
  }
}
