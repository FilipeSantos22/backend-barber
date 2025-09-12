export type Session = {
    id?: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    status: 'active' | 'inactive';
};