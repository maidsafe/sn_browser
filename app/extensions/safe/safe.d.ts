type XorUrl = string;

type SafeDataType = 'PublishedSeqAppendOnlyData' | 'PublishedImmutableData';

export interface SafeData {
    data_type: SafeDataType;
    files_map?: {
        [path: string]: XorUrl;
    };
    resolved_from: {
        data_type: SafeDataType;
        nrs_map: [Record<string, any>];
        public_name?: string;
        type_tag: number;
        version: number;
        xorname: Array<number>;
        xorurl: XorUrl;
    };
    type_tag: number;
    version: number;
    xorname: Array<number>;
}
