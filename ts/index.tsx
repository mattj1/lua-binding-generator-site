import {Component, createContext, createRef, Fragment, h, render} from 'preact';
// import {Exporter, DataSource, Parse, processTokens} from '../../lua-binding-generator/dist/index'
import {Exporter, DataSource, Parse, processTokens} from 'lua-binding-generator'
import {ExportC, ExportWriter} from "lua-binding-generator";
import MonacoEditor from "react-monaco-editor"
import {useEffect} from "preact/hooks";

let styles = require("./main.css")

let rawData5 =
`typedef struct Vector3 {
    float x;
    float y;
} Vector3;
 
typedef struct {
    Vector3 position;
    int health;
} Entity;
\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n`;


const IndexPage = () => {

    let width = 100;
    let height = 100;

    let editor0;
    let editor1;

    const editorContainer = createRef();

    function layout() {
        var GLOBAL_PADDING = 20;

        width = window.innerWidth - 2 * GLOBAL_PADDING;
        height = window.innerHeight - editorContainer.current.getBoundingClientRect().y

        let window_width = (width - 20) / 2;
        // console.log("onresize: ", width, height);

        editor0.layout({
            width: window_width, height
        });

        editor1.layout({
            width: window_width, height
        });
    }

    const runParser = (arg) => {

        let e = new Exporter();

        // Super hacky way of handling the color literals
        let dataSourceOptions = {

            OnDefine: function (k, v) {
                console.log("OnDefine: ", k, v)

                v = processTokens(v);

                if (v[0] == "CLITERAL" && v[2] == "Color") {
                    e.DefStructConst(k, e.GetStructForName("Color"), {
                        r: parseInt(v[5]),
                        g: parseInt(v[7]),
                        b: parseInt(v[9]),
                        a: parseInt(v[11])
                    })
                }
            }
        }

        let ds = new DataSource(arg, dataSourceOptions);

        Parse(e, ds);

        let c_output = "";
        let exportWriter: ExportWriter = {
            Write(s: String): any {
                // console.log(s);
                c_output += s;
            }
        }

        ExportC(e, exportWriter, false);

        editor1.getModel().setValue(c_output);
    }

    window.onresize = ev => {
        layout();
    }

    useEffect(() => {
        layout();
    }, []);


    useEffect(() => {
        if (editor0 && editor1) {
            runParser(editor0.getValue());
        }
    }, [editor0, editor1]);

    const editor0DidMount = (editor) => {
        // eslint-disable-next-line no-console
        console.log("editorDidMount", editor, editor.getValue(), editor.getModel());
        editor0 = editor;
    };

    const editor1DidMount = (editor) => {
        // eslint-disable-next-line no-console
        console.log("editorDidMount", editor, editor.getValue(), editor.getModel());
        editor1 = editor;
    };

    const onChange0 = (arg) => {
        runParser(arg);
    }

    return (
        <Fragment>
            <h4>Lua binding generator</h4>
            <div class={"row"} style={"margin-bottom: 8px;"}>
                <div class={"column"}>
                    Add C code here
                </div>
                <div className={"column"}>
                    Output
                </div>
            </div>
            <div ref={editorContainer} class={"row"}>
                <div class={"column"}>
                    <MonacoEditor editorDidMount={editor0DidMount} language={"cpp"} value={rawData5} onChange={onChange0}
                                  options={{selectOnLineNumbers: true}}/>
                </div>
                <div className={"column"}>
                    <MonacoEditor editorDidMount={editor1DidMount} language={"cpp"}/>
                </div>
            </div>
        </Fragment>);
}

let appDiv = document.getElementById('app');

if(appDiv == null) {
    appDiv = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);
}

render(<IndexPage/>, document.getElementById('app'));
