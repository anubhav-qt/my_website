// The Notch Clipboard guide at /notch-clipboard. Every fact here is checked
// against the app repo (github.com/anubhav-qt/notch-clipboard): README.md,
// README.txt, docs/plan-1.3.md, build.sh and the v1 release notes.
// Archived by scripts/log-content.ts like every other content module.

export interface GuideItem {
  title: string;
  text: string;
}

export interface GuideStep {
  title: string;
  text: string;
}

export interface GuideCommand {
  command: string;
  text: string;
}

const REPO_URL = 'https://github.com/anubhav-qt/notch-clipboard';

export const NOTCH_CLIPBOARD = {
  name: 'Notch Clipboard',
  tagline: "Clipboard history that lives in your MacBook's notch.",
  intro: [
    'Move the pointer up into the notch and the things you copied drop down from it. Click one to copy it again, then paste.',
    'It sits in the menu bar with no window and no Dock icon. Free and open source.',
  ],
  repoUrl: REPO_URL,
  releaseUrl: `${REPO_URL}/releases/tag/v1`,
  download: {
    url: `${REPO_URL}/releases/download/v1/Notch-Clipboard-v1.zip`,
    label: 'Download for Mac',
    // 371,827 bytes, shown the way Finder counts.
    detail: 'v1 (app 1.3.0), a 372 KB zip. Apple silicon, macOS 14 or later.',
  },
  video: {
    src: '/media/notch-clipboard-demo.mp4',
    poster: '/media/notch-clipboard-poster.jpg',
    caption: 'What it does, in 75 seconds. No sound.',
  },

  features: [
    { title: 'Hover the notch', text: 'Your history opens. Move away and it folds back in.' },
    { title: 'Click to copy', text: 'Click a clip to put it back on the clipboard, then press ⌘V.' },
    { title: 'Keeps everything', text: 'Text, links, images and files. Images show a small picture.' },
    { title: 'Save clips', text: 'The bookmark keeps a clip after a restart.' },
    { title: 'Filter and search', text: 'Show All, Text, Images or Saved, and search as you type.' },
    {
      title: 'Automatic categories',
      text: 'Apple Intelligence sorts each clip on your Mac. It starts with Work, Personal, Creative and Reference.',
    },
    { title: 'Your own categories', text: 'Rename, add, remove and drag to reorder them, 1 to 10.' },
    { title: 'Image titles', text: 'On macOS 27 each image gets a short title and a category too.' },
    {
      title: 'Pick several',
      text: 'Select mode copies many clips at once. Text pastes as one, joined with a space. Images copy as separate items.',
    },
    { title: 'Your colour', text: 'Pick the accent colour from presets or any hue.' },
    { title: 'Reorder history', text: 'Off at first. Turn it on and copying a clip again moves it to the top.' },
  ] satisfies GuideItem[],

  requirements: [
    { title: 'Apple silicon', text: 'An M1 Mac or newer. It does not run on Intel Macs.' },
    { title: 'macOS 14 or later', text: 'Everything except the extras below works from macOS 14.' },
    { title: 'A notch, ideally', text: 'No notch? Open it from the clipboard icon in the menu bar.' },
    {
      title: 'Apple Intelligence',
      text: 'Needed for automatic categories, on macOS 26 or later. Without it the tabs hide and the rest works.',
    },
    { title: 'macOS 27', text: 'Needed for image titles and sorting images.' },
  ] satisfies GuideItem[],

  install: [
    { title: 'Download', text: 'Click Download for Mac above. The zip lands in your Downloads folder.' },
    {
      title: 'Unzip',
      text: 'Open Downloads and double-click the zip. You get Notch Clipboard. If it is already there, your browser unzipped it for you.',
    },
    { title: 'Move', text: 'Drag Notch Clipboard into your Applications folder.' },
    {
      title: 'Open',
      text: "Double-click it in Applications. macOS says it can't check the app for malware. Click Done.",
    },
    {
      title: 'Allow',
      text: 'Open System Settings and click Privacy & Security. Scroll down to Security. Next to "Notch Clipboard was blocked", click Open Anyway.',
    },
    { title: 'Confirm', text: 'Click Open Anyway again and enter your Mac password.' },
  ] satisfies GuideStep[],
  installNote: 'You only do steps 4 to 6 once. After that it opens like any other app.',
  warningNote:
    "Why the warning? The app isn't notarized, which means it isn't registered with Apple yet. It is open source, so anyone can read every line.",
  afterInstall: 'A small clipboard icon shows up in the menu bar. That is the app.',

  // Help tab.
  usage: [
    { title: 'Copy as usual', text: 'Every copy is kept while the app runs.' },
    { title: 'Open it', text: 'Move the pointer up into the notch. Move away, or press Escape, to close it.' },
    { title: 'Paste an old clip', text: 'Click it to copy it again, then press ⌘V where you want it.' },
    { title: 'Save a clip', text: 'Click its bookmark. Saved clips stay after a restart.' },
    { title: 'Find a clip', text: 'Type in Search. Return copies the first result.' },
    {
      title: 'Categories',
      text: 'The tabs beside Search show a category. More holds the rest, plus Add/Edit categories.',
    },
    {
      title: 'Copy several',
      text: 'Click the select icon, pick clips in the order you want, then click Done.',
    },
    { title: 'Clear history', text: 'The trash icon clears history. Saved clips stay.' },
    { title: 'No notch', text: 'Click the clipboard icon in the menu bar and choose Open Clipboard History.' },
  ] satisfies GuideItem[],

  loginItems:
    'The app does not start at login by itself. To make it: open System Settings > General > Login Items (Login Items & Extensions on newer macOS), click + and pick Notch Clipboard.',
  quit: 'Click the clipboard icon in the menu bar and choose Quit Notch Clipboard. The gear in the panel has Quit Clipboard too. Quitting clears history. Saved clips stay.',
  uninstall: [
    'Quit the app, then drag it from Applications to the Trash.',
    'Saved clips are kept. To remove them too, delete the folder ~/Library/Application Support/Notch Clipboard.',
    'Built from source? Run ./uninstall.sh in the repo. It removes the app and the login item and puts the screenshot shortcuts back.',
  ],

  privacy: [
    'Nothing leaves your Mac. The app has no network code, and sorting uses Apple\'s on-device model.',
    'History lives only in memory and is gone when you quit.',
    'Saved clips are in ~/Library/Application Support/Notch Clipboard/saved.plist. Only your account can read it. It is not encrypted.',
    'Clips that password managers mark as hidden (concealed or transient) are never kept. Text you copy by hand is kept like any clip.',
    'The same folder holds small timing logs for fixing bugs. They hold no copied text, images or mouse paths.',
  ],

  faq: [
    { title: 'Is it free?', text: 'Yes. It is open source under the MIT license.' },
    {
      title: "Why does macOS say it can't check the app?",
      text: 'The app is not notarized yet. Allow it once with Open Anyway in System Settings > Privacy & Security.',
    },
    { title: 'Does it work on an Intel Mac?', text: 'No. It is built for Apple silicon only.' },
    {
      title: 'My Mac has no notch. Can I use it?',
      text: 'Yes. Click the clipboard icon in the menu bar and choose Open Clipboard History.',
    },
    {
      title: 'Where did my history go after a restart?',
      text: 'History is kept in memory only, so quitting clears it. Bookmark a clip to keep it.',
    },
    {
      title: "I don't see the category tabs.",
      text: 'They need Apple Intelligence turned on, on macOS 26 or later. Everything else works without it.',
    },
    {
      title: 'Can screenshots go straight to the clipboard?',
      text: 'Yes. Hold Control as well: Control-⌘⇧4 copies the region you drag. The build from source swaps them, so plain ⌘⇧3 and ⌘⇧4 copy.',
    },
    {
      title: 'Will it keep my passwords?',
      text: 'Not ones a password manager marks as hidden. Anything else you copy is kept until you quit.',
    },
    { title: 'Is there a size limit?', text: 'A single copy over 64 MiB is skipped.' },
    {
      title: 'Can I paste several clips at once?',
      text: "Yes, with Select mode. Text and images can't be picked together.",
    },
  ] satisfies GuideItem[],

  developers: {
    intro:
      'Swift, SwiftUI and AppKit, built with plain swiftc. No Xcode project, but you need Xcode for its Swift compiler.',
    clone: `git clone ${REPO_URL}.git`,
    install: 'cd notch-clipboard && ./install.sh',
    installNote:
      'install.sh builds the app, installs it to ~/Applications, makes ⌘⇧3 and ⌘⇧4 copy to the clipboard (Control-⌘⇧3/4 still save files) and starts it at login.',
    commands: [
      { command: './build.sh', text: 'Builds build/Notch Clipboard.app' },
      { command: './test.sh', text: 'Unit tests, on a private clipboard' },
      { command: './test-ui-inputs.sh', text: 'Clicks and types into a test copy of the panel' },
      { command: './test-live.sh', text: 'Drives the installed app and moves the real pointer' },
      { command: './uninstall.sh', text: 'Removes the app and login item, restores screenshot keys' },
    ] satisfies GuideCommand[],
    checksumNote: 'To check the download, its SHA-256 is:',
    checksum: '96d292cdf56fd47682f7849b1f64a557be5a9e465127171700a2e09b7be2c9cd',
  },
};
