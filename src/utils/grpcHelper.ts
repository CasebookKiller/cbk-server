// src/utils/grpcHelper.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { getProtoPath } from './protoPath';

export function createGrpcClient(packageName: string, serviceName: string) {
  const PROTO_PATH = getProtoPath(packageName);
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const proto = grpc.loadPackageDefinition(packageDefinition) as any;
  const ServiceClient = proto.tinkoff.public.invest.api.contract.v1[serviceName];
  return new ServiceClient(
    'invest-public-api.tbank.ru:443',
    grpc.credentials.createSsl(null, null, null, { rejectUnauthorized: false }),
    { 'grpc.ssl_target_name_override': 'invest-public-api.tbank.ru' }
  );
}

export function createMetadata(token: string): grpc.Metadata {
  const meta = new grpc.Metadata();
  meta.add('Authorization', `Bearer ${token}`);
  return meta;
}