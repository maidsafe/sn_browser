import ref from 'ref';
import ArrayType from 'ref-array';
import StructType from 'ref-struct';

export const u8 = ref.types.uint8;
export const u32 = ref.types.uint32;
export const u64 = ref.types.uint64;
export const usize = ref.types.size_t;
export const bool = ref.types.bool;
export const int32 = ref.types.int32;
export const Void = ref.types.void;
export const Null = ref.NULL;
export const CString = ref.types.CString;
export const XorName = ArrayType(u8, 32);
export const U8Array = ArrayType(u8, 32);

// Pointer Types
export const voidPointer = ref.refType(Void);
export const u8Pointer = ref.refType(u8);
export const ClientHandlePointer = ref.refType(voidPointer);

export const AppExchangeInfo = StructType({
  id: CString,
  scope: CString,
  name: CString,
  vendor: CString
});

export const PermissionSet = StructType({
  read: bool,
  insert: bool,
  update: bool,
  delete: bool,
  manage_permissions: bool
});

export const ContainerPermissions = StructType({
  cont_name: CString,
  access: PermissionSet
});

export const RegisteredApp = StructType({
  app_info: AppExchangeInfo,
  containers: ref.refType(ContainerPermissions),
  containers_len: usize,
  containers_cap: usize
});

export const RegisteredAppPointer = ref.refType(RegisteredApp);

export const AuthReq = StructType({
  app: AppExchangeInfo,
  app_container: bool,
  containers: ref.refType(ContainerPermissions),
  containers_len: usize,
  containers_cap: usize
});

export const AuthReqPointer = ref.refType(AuthReq);

export const ContainersReq = StructType({
  app: AppExchangeInfo,
  containers: ref.refType(ContainerPermissions),
  containers_len: usize,
  containers_cap: usize
});

export const ContainersReqPointer = ref.refType(ContainersReq);

export const FfiResult = StructType({
  error_code: int32,
  description: CString
});

export const FfiResultPointer = ref.refType(FfiResult);

export const AccountInfo = StructType({
  mutations_done: u64,
  mutations_available: u64
});

export const AccountInfoPointer = ref.refType(AccountInfo);

export const ShareMData = StructType({
  type_tag: u64,
  name: XorName,
  perms: PermissionSet
});

export const ShareMDataReq = StructType({
  app: AppExchangeInfo,
  mdata: ref.refType(ShareMData),
  mdata_len: usize
});

export const ShareMDataReqPointer = ref.refType(ShareMDataReq);

export const UserMetadata = StructType({
  name: CString,
  description: CString,
  xor_name: XorName,
  type_tag: u64
});

export const AppAccess = StructType({
  sign_key: U8Array,
  permissions: PermissionSet,
  app_name: CString,
  app_id: u8Pointer,
  app_id_len: usize
});

export const AppAccessPointer = ref.refType(AppAccess);

export const allocAppHandlePointer = () => (ref.alloc(ClientHandlePointer));

export const allocCString = (str) => (ref.allocCString(str));

export const allocAuthReq = (req) => (ref.alloc(AuthReq, req));

export const allocContainerReq = (req) => (ref.alloc(ContainersReq, req));

export const allocSharedMdataReq = (req) => (ref.alloc(ShareMDataReq, req));
