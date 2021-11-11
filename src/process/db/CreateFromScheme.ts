import { Process } from "@cmtv/processes";

import { IO } from "src/util/IO";

export class CreateFromScheme extends Process
{
    processName = () => 'Создание базы данных по шаблону';

    process()
    {
        IO.copyFile('data/db/scheme.db', 'data/db/data.db');
    }
}