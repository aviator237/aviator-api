export enum NotchPayPaymentEvent {
    PAYMENT_COMPLETE = "payment.complete",
    PAYMENT_INITIALISE = "payment.initialized",
    PAYMENT_EN_COURS = "payment.processing",
    PAYMENT_ECHOUE = "payment.failed",
    PAYMENT_REMBOURSE_AU_CLIENT = "payment.refunded",
    PAYMENT_ANNULE = "payment.canceled",
    TRANSFERT_INITIALISE = "transfer.initiated",
    TRANSFERT_COMPLETE = "transfer.complete",
    TRANSFERT_ECHOUE = "transfer.failed",

}
