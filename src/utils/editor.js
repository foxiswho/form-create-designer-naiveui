import {EditorState, Compartment, StateEffect} from "@codemirror/state"
import {EditorView} from "@codemirror/view"
import {javascript} from '@codemirror/lang-javascript'
import {basicSetup} from "codemirror";
import {json} from "@codemirror/lang-json";
import { CompletionContext } from '@codemirror/autocomplete';

/**
 * 创建一个compartment,并和对其修改的run函数
 * @param view
 * @returns
 */
    // https://codemirror.net/examples/config/
    // https://github.com/uiwjs/react-codemirror/blob/22cc81971a/src/useCodeMirror.ts#L144
    // https://gist.github.com/s-cork/e7104bace090702f6acbc3004228f2cb
export const createEditorCompartment = () => {
        const compartment = new Compartment()
        const run = (extension, view) => {
            if (compartment.get(view.state)) {
                //动态地重新配置插件
                view.dispatch({effects: compartment.reconfigure(extension)}) // reconfigure
            } else {
                //向编辑器注入某一个插件
                view.dispatch({effects: StateEffect.appendConfig.of(compartment.of(extension))})// inject
            }
        }
        return {compartment, run}
}

export function EditorViewNew(el, val) {
    return new EditorView({
        state: EditorState.create({
            doc: val,  //这是文本
            extensions: [basicSetup, javascript(), json()]
        }), //编辑器状态，编辑器视图创建时初始化的状态
        parent: el, //挂载的dom，可以通过parent挂载到指定的div块
    })
}