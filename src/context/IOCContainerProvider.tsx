import React from "react";

const IOCContainerContext = React.createContext({});

const IOCContainerProvider: React.FC = (props) => {
  return (
    <IOCContainerContext.Provider value={{}}>
      {props.children}
    </IOCContainerContext.Provider>
  );
};

export default IOCContainerProvider;
