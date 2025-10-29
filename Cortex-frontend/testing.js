// In your React component
const sendToBackground = () => {
  chrome.runtime.sendMessage({
    action: "callBackgroundFunction",
    data: {
      elementId: "myElement",
      someData: "hello from React" 
    }
  }, (response) => {
    console.log("Background response:", response);
  });
};

export default sendToBackground