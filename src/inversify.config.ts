import { Container } from "inversify";
import { useFirestoreService } from "./data/firestoreClient/dependecyRegisterar";

const container = new Container();

useFirestoreService(container);

export default container;
