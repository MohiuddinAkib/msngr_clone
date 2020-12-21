import React from "react";
import container from "@src/inversify.config";
import { useFirestoreService } from "@src/data/firestoreClient/dependecyRegisterar";

export const IOCContainerContext = React.createContext({ container });

const IOCContainerProvider: React.FC = (props) => {
  React.useEffect(() => {
    useFirestoreService(container);
  }, []);

  return (
    <IOCContainerContext.Provider value={{ container }}>
      {props.children}
    </IOCContainerContext.Provider>
  );
};

export default IOCContainerProvider;
