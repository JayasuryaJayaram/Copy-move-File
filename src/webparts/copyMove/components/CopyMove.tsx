import * as React from "react";
import styles from "./CopyMove.module.scss";
import { Modal } from "antd"; // Import Modal from Ant Design
import { getAllFilesInFolder } from "../service/spservice";
import { ICopyMoveProps } from "./ICopyMoveProps";
import { copyFile, moveFile } from "../service/spservice";

const CopyMove = (props: ICopyMoveProps) => {
  const [files, setFiles] = React.useState<any[]>([]);
  const [successModalVisible, setSuccessModalVisible] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  React.useEffect(() => {
    const fetchFiles = async () => {
      try {
        const files = await getAllFilesInFolder();
        setFiles(files);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };
    fetchFiles();
  }, []);

  const handleCopy = async (file: any) => {
    try {
      await copyFile(file);
      const updatedFiles = await getAllFilesInFolder();
      setFiles(updatedFiles);
      setSuccessMessage("File copied successfully");
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error copying file:", error);
    }
  };

  const handleMove = async (file: any) => {
    try {
      await moveFile(file);
      const updatedFiles = await getAllFilesInFolder();
      setFiles(updatedFiles);
      setSuccessMessage("File moved successfully");
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error moving file:", error);
    }
  };

  const closeModal = () => {
    setSuccessModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Files in DocumentsUploaded</div>
      <div className={styles.filesContainer}>
        {files.map((file) => (
          <div key={file.UniqueId} className={styles.fileItem}>
            <div style={{ marginBottom: "10px" }}>{file.Name}</div>
            <button
              onClick={() => handleCopy(file)}
              className={styles.copyButton}
            >
              Copy
            </button>
            <button
              onClick={() => handleMove(file)}
              className={styles.moveButton}
            >
              Move
            </button>
          </div>
        ))}
      </div>
      <Modal
        title="Success"
        visible={successModalVisible}
        onOk={closeModal}
        onCancel={closeModal}
      >
        {successMessage}
      </Modal>
    </div>
  );
};

export default CopyMove;
