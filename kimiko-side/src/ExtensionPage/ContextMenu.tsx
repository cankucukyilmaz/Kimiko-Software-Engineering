import React from 'react';



class ContMenuItem extends React.Component<{ onClick?: any }, {}>{
    constructor(props: any) {
        super(props);
        
    }

    render() {
        return (
            <div className="ContMenuItem" onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }

}



interface Props {
    funcs: any,
    poses: {
        top: number | undefined,
        left: number | undefined
    }
}


class ContextMenu extends React.Component<Props, {}>{


    constructor(props: Props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: any) {
        //e.preventDefault();
    }


    render() {

        let pos = this.props.poses;
        let funcs = this.props.funcs;

        return (
            <div
                id="Kimiko-Context-Menu"
                className="Context-Menu"
                style={{ top: pos.top + "px", left: pos.left + "px" }}
                onClick={funcs.closeContext}
            >

                <ContMenuItem onClick={funcs.openSettings}>Settings</ContMenuItem>
                <ContMenuItem>Invite friend</ContMenuItem>


            </div>
        );
    }

}
export default ContextMenu;