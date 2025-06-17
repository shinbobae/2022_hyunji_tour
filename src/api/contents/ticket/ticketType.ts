export type IssueTicketRequest = {
    booking_date_from: number;
    booking_date_to: number;
};

export type DeleteTicketRequest = {
    ticket_list: { booking_idx: number }[];
};
