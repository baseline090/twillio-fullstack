import React, { createContext, useState, useContext, useEffect } from "react";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const [addcontactmodal, setAddContactModal] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState();
  const [schedulemodal, setscheduleModal] = useState(false);
  const [addVariablemodal, setAddVariableModal] = useState(false);
  const [value, setValue] = useState("");
  const [file, setFile] = useState(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(null);
  const [selectedTemplate, setselectedTemplate] = useState(null);
  const [dataOfContactsFromFile, setDataOfContactsFromFile] = useState([]);
  const [dataOfContactsFromInput, setDataOfContactsFromInput] = useState([]);
  const [templateVariables, settemplateVariables] = useState([]);
  // console.log("user is", userDetails);
  // useEffect(() => {
  //   if (userDetails && userDetails._id) {
  //     setisLoggedIn(true);
  //   }
  // }, []);

  const toggleModal = () => {
    setAddContactModal(!addcontactmodal);
  };
  const toggleModalOfVariables = () => {
    setAddVariableModal(true);
  };

  return (
    <AppContext.Provider
      value={{
        addcontactmodal,
        setAddContactModal,
        value,
        setValue,
        file,
        setFile,
        fileUploadLoading,
        setFileUploadLoading,
        dataOfContactsFromFile,
        setDataOfContactsFromFile,
        toggleModal,
        addVariablemodal,
        setAddVariableModal,
        toggleModalOfVariables,
        templateVariables,
        settemplateVariables,
        dataOfContactsFromInput,
        setDataOfContactsFromInput,
        schedulemodal,
        setscheduleModal,
        isLoggedIn,
        setisLoggedIn,
        selectedTemplate,
        setselectedTemplate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
