let isPlaying = false
let registeredWorker = false;
let mediaWorker;
let mediaClient;
let prevMeshMedia = {}
let meshLinksAdded = {}
const videoLoadProgress = document.getElementById("videoLoadProgress")
const fileHackingSelectButton = document.getElementById("fileHackingSelectButton")
const fileHackingSelectButton2 = document.getElementById("fileHackingSelectButton2")

const isScreenLockSupported = () => ('wakeLock' in navigator);

const getScreenLock = async () => {
  try {
	  if(isScreenLockSupported()){
	    let screenLock = await navigator.wakeLock.request('screen');
	    console.info('screenLock', screenLock)
	  }
  } catch(err) {
     console.log(err.name, err.message);
  }
}

