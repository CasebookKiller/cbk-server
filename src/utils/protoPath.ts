// src/utils/protoPath.ts
import path from 'path';

export function getProtoPath(protoFileName: string): string {
  // На сервере прото-файлы лежат в папке proto/ на уровень выше src/
  return path.join(__dirname, '../../proto', protoFileName);
}