import { createDiscreteApi } from "naive-ui";
const { message } = createDiscreteApi(["message"]);
const errorMessage = (msg) => {
    return message.error(msg);
};

export default errorMessage;