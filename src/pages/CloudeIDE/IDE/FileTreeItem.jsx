import { ChevronDown, ChevronRight, FilePlus, Folder, FolderPlus } from "lucide-react";
import { useState } from "react";

import { FileIcon, defaultStyles } from "react-file-icon";

export const FileTreeItem = ({
  item,
  depth,
  onAdd,
  isActive,
  onFileClick,
  handleContextMenu,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = item.type === "folder";

  // --- AAPKA FUNCTION YAHA LINK HO GYA ---
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    return (
      <div className="w-3 h-3 flex-shrink-0">
        <FileIcon extension={ext} {...defaultStyles[ext]} />
      </div>
    );
  };

  return (
    <div className="select-none">
      <div
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          } else {
            onFileClick(item.id, item.name);
          }
        }}
        onContextMenu={(e) => handleContextMenu(e, item.id)}
        style={{ paddingLeft: `${depth * 12}px` }}
        className={`flex items-center justify-between py-1.5 px-2 cursor-pointer rounded-md group transition-all ${
          isActive
            ? "bg-blue-500/10 text-blue-400"
            : "hover:bg-zinc-800/40 text-zinc-400"
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {/* Chevron logic */}
          <div className="w-4 flex items-center justify-center">
            {isFolder &&
              (isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
          </div>

          {/* ICON LINKAGE HERE */}
          {isFolder ? (
            <Folder
              size={14}
              className={
                isOpen ? "text-blue-500 fill-blue-500/10" : "text-zinc-500"
              }
            />
          ) : (
            // Humne aapka function yahan call kar diya
            getFileIcon(item.name)
          )}

          <span className="text-[12px] truncate">{item.name}</span>
        </div>

        {/* Hover buttons for folders */}
        {isFolder && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item.id, "file");
              }}
            >
              <FilePlus size={12} className="hover:text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd(item.id, "folder");
              }}
            >
              <FolderPlus size={12} className="hover:text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Recursive children */}
      {isFolder && isOpen && item.children && (
        <div className="border-l border-zinc-800/40 ml-4">
          {item.children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
              onAdd={onAdd}
              isActive={isActive}
              onFileClick={onFileClick}
              handleContextMenu={handleContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};