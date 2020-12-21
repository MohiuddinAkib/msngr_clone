import { Container } from "inversify";
import AuthService from "../services/AuthService";
import { providerTypes } from "@src/core/providerTypes";
import IAuthService from "@src/core/services/IAuthService";
import ConversationService from "../services/ConversationService";
import IConversationService from "@src/core/services/IConversationService";

export const IOC_FIREBASE_NAME = "firebase";

/**
 * Register firestore client dependecies
 * @param container DI container
 */
export const useFirestoreService = (container: Container) => {
  container
    .bind<IAuthService>(providerTypes.AuthService)
    .to(AuthService)
    .whenTargetNamed(IOC_FIREBASE_NAME);
  container
    .bind<IConversationService>(providerTypes.ConversationService)
    .to(ConversationService)
    .whenTargetNamed(IOC_FIREBASE_NAME);
};
