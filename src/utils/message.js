import {useMessage} from 'naive-ui';
const message = useMessage();
const errorMessage = (msg) => {
    return message.error(msg);
};

export default errorMessage;