declare global {
    interface Window {
      showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
    }
  
    interface FileSystemDirectoryHandle {
      kind: string;
      name: string;
      getFile: (name: string, options?: FileSystemHandleGetFileOptions) => Promise<File>;
      getDirectory: (name: string, options?: FileSystemHandleGetDirectoryOptions) => Promise<FileSystemDirectoryHandle>;
      removeEntry: (name: string, options?: FileSystemRemoveOptions) => Promise<void>;
      resolve: (possibleDescendant: FileSystemHandle) => Promise<boolean>;
      values: () => AsyncIterable<FileSystemHandle>;
    }
  
    interface FileSystemHandle {
      kind: string;
      name: string;
      isSameEntry: (other: FileSystemHandle) => Promise<boolean>;
    }
  
    interface FileSystemFileHandle extends FileSystemHandle {
      getFile: () => Promise<File>;
    }
  
    interface FileSystemEntry {
      isFile: boolean;
      isDirectory: boolean;
      name: string;
      fullPath: string;
      filesystem: DOMFileSystem;
    }
  }