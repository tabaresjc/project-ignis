import { IsInt } from "class-validator";

export class CreatePhraseDto {
    @IsInt()
    userID: number;
}
