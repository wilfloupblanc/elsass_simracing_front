import {Alert} from "../Alert/index.jsx";
import {DeleteAccount} from "../DeleteAccount/index.jsx";

export const DeleteAccountModal = () => {

    return (
        <Alert openBtnText="Delete Account">

            {({onClose}) => (
                <>
                    <DeleteAccount onClose={onClose}/>
                </>
            )}
        </Alert>
    )
}