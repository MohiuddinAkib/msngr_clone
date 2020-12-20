import { Container } from "inversify";
import AuthService from "../services/AuthService";
import { providerTypes } from "@src/core/providerTypes";
import IAuthService from "@src/core/services/IAuthService";
import ConversationService from "../services/ConversationService";
import IConversationService from "@src/core/services/IConversationService";

/**
 * Register firestore client dependecies
 * @param container DI container
 */
 export const useFirestoreService = (container: Container) => {
    container.bind<IAuthService>(providerTypes.AuthService).to(AuthService)
    container.bind<IConversationService>(providerTypes.AuthService).to(ConversationService)
  }