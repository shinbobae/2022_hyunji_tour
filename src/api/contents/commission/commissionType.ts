export type CommissionItem = { commission_seq_no: number; commission: number };
export type CommissionSaveItem = { commission_seq_no: number; commission: number };
export type CommissionResponse = CommissionItem[];
export type CommissionSaveRequest = { commission_list: CommissionSaveItem[] };
