import React from "react";
import container from "@src/inversify.config";

export const IOCContainerContext = React.createContext({ container });

const IOCContainerProvider: React.FC = (props) => {
  return (
    <IOCContainerContext.Provider value={{ container }}>
      {props.children}
    </IOCContainerContext.Provider>
  );
};

export default IOCContainerProvider;
