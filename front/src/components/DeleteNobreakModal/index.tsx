import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';
import { Modal, ModalDialog, ModalClose, Typography, Grid } from '@mui/joy';
import LoadingButton from '@mui/lab/LoadingButton';
import { IconButton } from '@mui/material';
import { NobreakService } from '@/core/services/nobreak';
import { INobreak } from '@/core/types/nobreak';
export interface DeleteNobreakModalProps {
    nobreak: INobreak;
    deleteResponseAlert: any;
}

const DeleteNobreakModal = (props: DeleteNobreakModalProps) => {
    const [showModal, setShowModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const { mutate, isPending } = NobreakService.useMutateDeleteNobreak(props?.nobreak?.id?.toString() || '');
    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const deleteNobreak = async () => {
        // setLoadingDelete(true);
        mutate();
        // setLoadingDelete(false);
        // closeModal();
    };

    return (
        <>
            <IconButton
                aria-label="delete nobreak"
                color="error"
                onClick={() => setShowModal(true)}>
                <DeleteIcon />
            </IconButton>
            <Modal
                open={showModal}
                onClose={closeModal}
                aria-labelledby="change-professor-modal-title"
                aria-describedby="change-professor-modal-description"
            >
                <ModalDialog size="md">
                    <ModalClose />
                    <form>
                        <Typography
                            style={{ fontSize: "17px", textAlign: "center", marginRight: '40px' }}
                        >
                            Are you sure you want to delete nobreak <b>{props?.nobreak?.name}</b>?
                        </Typography>
                        <br />
                        <Grid>
                            <Grid className="my-2">
                                <LoadingButton
                                    onClick={deleteNobreak} 
                                    color="error"
                                    fullWidth
                                    loading={isPending}
                                    variant="outlined"
                                >
                                    <span>Delete</span>
                                </LoadingButton>
                            </Grid>
                        </Grid>
                        {/* {props?.deleteResponseAlert} */}
                        <hr />
                    </form>
                </ModalDialog>
            </Modal>
        </>
    );
};

export default DeleteNobreakModal;