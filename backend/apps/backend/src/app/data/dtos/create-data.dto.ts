import { AnnotationEnum } from '../entity/data.entity';

import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateDataDto {
    @IsNumber()
    @IsNotEmpty()
    dur!: number;

    @IsNotEmpty()
    proto!: string;

    @IsNotEmpty()
    service!: string;

    @IsNotEmpty()
    state!: string;

    @IsNumber()
    @IsNotEmpty()
    spkts!: number;

    @IsNumber()
    @IsNotEmpty()
    dpkts!: number;

    @IsNumber()
    @IsNotEmpty()
    sbytes!: number;

    @IsNumber()
    @IsNotEmpty()
    dbytes!: number;

    @IsNumber()
    @IsNotEmpty()
    sload!: number;

    @IsNumber()
    @IsNotEmpty()
    dloss!: number;

    @IsNumber()
    @IsNotEmpty()
    dinpkt!: number;

    @IsNumber()
    @IsNotEmpty()
    tcprtt!: number;

    @IsNumber()
    @IsNotEmpty()
    smean!: number;

    @IsNumber()
    @IsNotEmpty()
    transDepth!: number;

    @IsNumber()
    @IsNotEmpty()
    ctSrcDportLtm!: number;

    @IsNumber()
    @IsNotEmpty()
    isFtpLogin!: number;

    @IsNumber()
    @IsNotEmpty()
    ctFlwHttpMthd!: number;

    @IsNumber()
    @IsNotEmpty()
    speedOfOperationsToSpeedOfDataBytes!: number;

    @IsNumber()
    @IsNotEmpty()
    timeForASingleProcess!: number;

    @IsNumber()
    @IsNotEmpty()
    ratioOfDataFlow!: number;

    @IsNumber()
    @IsNotEmpty()
    ratioOfPacketFlow!: number;

    @IsNumber()
    @IsNotEmpty()
    totalPageErrors!: number;

    @IsNumber()
    @IsNotEmpty()
    networkUsage!: number;

    @IsNumber()
    @IsNotEmpty()
    networkActivityRate!: number;

    @IsEnum(AnnotationEnum)
    annotation!: AnnotationEnum;

    @IsUUID()
    @IsNotEmpty()
    serverId!: string;
}
