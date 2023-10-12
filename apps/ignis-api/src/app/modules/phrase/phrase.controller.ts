import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  Res,
  InternalServerErrorException,
  Logger,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePhraseDto } from './dto/create-phrase.dto';
import { audioFileUploaParsePipe, fileInterceptorOptions } from './modules/multer';
import { PhraseService } from './phrase.service';
import { Response } from 'express';
import { MIME_TYPES_MAP } from './constants';

@Controller('audio')
export class PhraseController {
  constructor(private readonly phraseService: PhraseService) {}

  @Post()
  create(@Body() createPrhaseDto: CreatePhraseDto) {
    return this.phraseService.create(createPrhaseDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phraseService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phraseService.remove(+id);
  }

  @Post('user/:user_id/phrase/:phrase_id')
  @UseInterceptors(FileInterceptor('audio_file', fileInterceptorOptions()))
  @HttpCode(204)
  async uploadPhraseFile(
    @Param('user_id') userID: number,
    @Param('phrase_id') phraseID: number,
    @UploadedFile(audioFileUploaParsePipe())
    file: Express.Multer.File
  ) {
    await this.phraseService.transformAndUpdateAudioPhrase(phraseID, userID, file);
  }

  @Get('user/:user_id/phrase/:phrase_id/:audio_format')
  @HttpCode(200)
  async retrieveAudioByFormat(
    @Param('user_id') userID: number,
    @Param('phrase_id') phraseID: number,
    @Param('audio_format') format: string,
    @Res() res: Response,
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
      throw new InternalServerErrorException('Internal error prevented the streaming of the requested file.')
    }
  }
}
