import React from 'react';
import { INPUT_CONSTS } from '../kimiko-common/vars';

interface Props {
    newInput: any;
    counterData: number;
}
interface State {
    value: string
}


class Inputue extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.keyHandler = this.keyHandler.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state = { value: "" };
    }

    keyHandler(e: React.KeyboardEvent<HTMLElement>) {
        let target = e.target as HTMLInputElement;
        if (e.code === "Enter") {
            let input: string = target.value;
            if (input) {
                this.props.newInput(target.value);
                this.setState({ value: "" });
                target.classList.remove("Ok");
            }
        }
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {



        let value = e.target.value;
        let classList = e.target.classList;
        classList.remove("NotOk");

        if (value.length < INPUT_CONSTS.MESSAGE) {
            this.setState({ value: value });
        } else {
            classList.remove("Ok");
            classList.add("NotOk");
            setTimeout(() => {
                classList.add("Ok");
                classList.remove("NotOk");
            }, 400);
        }

        if (value.length === 0) {
            classList.remove("NotOk");
            classList.remove("Ok");
        }



    }

    render() {

        let online = this.props.counterData;
        let placeHoler = online ? `${online} people online!` : `No one is here!`

        return (
            <div className="InputueCont">
                <input
                    type="text"
                    onKeyPress={this.keyHandler}
                    onChange={this.handleInputChange}
                    className="TextInput"
                    value={this.state.value}
                    spellCheck="false"
                    autoComplete="false"
                    placeholder={placeHoler} />
            </div>
        )
    }

}

export default Inputue;