// Enable side panel when extension icon is clicked

const GOOGLE_ORIGIN = 'https://www.google.com';

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Optional: Control side panel availability based on current website
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  
  try {
    const url = new URL(tab.url);
    
    // Enable side panel for all websites (remove this condition if you want it everywhere)
    if (url.origin === GOOGLE_ORIGIN) {
      await chrome.sidePanel.setOptions({
        tabId,
        path: 'index.html',
        enabled: true
      });
    } else {
      await chrome.sidePanel.setOptions({
        tabId,
        enabled: false
      });
    }
  } catch (error) {
    console.error('Error processing URL:', error);
  }
});


// // Create context menu item
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'openSidePanel',
//     title: 'Open Cortex Side Panel',
//     contexts: ['all']
//   });
// });

// // Handle context menu clicks
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'openSidePanel') {
//     chrome.sidePanel.open({ windowId: tab.windowId });
//   }
// });