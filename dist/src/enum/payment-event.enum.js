"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotchPayPaymentEvent = void 0;
var NotchPayPaymentEvent;
(function (NotchPayPaymentEvent) {
    NotchPayPaymentEvent["PAYMENT_COMPLETE"] = "payment.complete";
    NotchPayPaymentEvent["PAYMENT_INITIALISE"] = "payment.initialized";
    NotchPayPaymentEvent["PAYMENT_EN_COURS"] = "payment.processing";
    NotchPayPaymentEvent["PAYMENT_ECHOUE"] = "payment.failed";
    NotchPayPaymentEvent["PAYMENT_REMBOURSE_AU_CLIENT"] = "payment.refunded";
    NotchPayPaymentEvent["PAYMENT_ANNULE"] = "payment.canceled";
    NotchPayPaymentEvent["TRANSFERT_INITIALISE"] = "transfer.initiated";
    NotchPayPaymentEvent["TRANSFERT_COMPLETE"] = "transfer.complete";
    NotchPayPaymentEvent["TRANSFERT_ECHOUE"] = "transfer.failed";
})(NotchPayPaymentEvent || (exports.NotchPayPaymentEvent = NotchPayPaymentEvent = {}));
//# sourceMappingURL=payment-event.enum.js.map