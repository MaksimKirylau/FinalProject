export class PurchaseDto {
    purchaseId: number;
    userId: number;
    recordId: number;
    sessionId: string;
    status: 'pending' | 'paid' | 'failed';
}
