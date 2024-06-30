import {useMessage} from 'naive-ui';
const errorMessage = (msg) => {
    const message = useMessage();
    return message.error(msg);
};

export default errorMessage;