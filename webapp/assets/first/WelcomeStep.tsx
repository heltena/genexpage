import * as React from "react";

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card';
import Paper from 'material-ui/Paper';
import { TitleStep } from './BaseStep';

export interface WelcomeStepProps {
    actions: any;
}

export interface WelcomeStepState {
}

export class WelcomeStep extends React.Component<WelcomeStepProps, WelcomeStepState> {

    constructor(props: WelcomeStepProps, state: WelcomeStepState) {
        super(props, state);
        this.state = {
        };
    }

    render() {
        const styles = {
            div: {
                width: '100%',
                textAlign: 'center'
            },
            paper: {
                display: 'flex'
            },
            img: {
                flex: 1,
                width: "360px",
                height: "544px"
            },
            text: {
                flex: 3,
                "padding-left": 40,
                textAlign: "left"
            }
        }

        return (
            <div style={styles.div}>
                <Card>
                    <TitleStep
                        title="Welcome" 
                        actions={this.props.actions} />
                    <CardText>
                        <Paper style={styles.paper} zDepth={0}>
                            <img style={styles.img} src="/static/sample.png" />
                            <div style={styles.text}>

                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla et leo purus. Donec aliquet malesuada nisl, 
                                    non consequat ex rutrum id. Nunc accumsan semper nunc nec iaculis. Vestibulum condimentum ipsum auctor 
                                    lectus fermentum porttitor. Praesent varius tortor odio, sed mollis purus convallis sit amet. 
                                    Fusce pharetra tincidunt tortor, suscipit consectetur felis malesuada at. Aenean quis nibh maximus, 
                                    gravida ante vitae, condimentum neque. Phasellus enim diam, sagittis ut quam ac, sodales rhoncus sapien. 
                                    Donec elementum, diam nec eleifend laoreet, eros lorem lacinia nulla, id consectetur enim nunc nec quam. 
                                    Duis venenatis nibh sed quam porta, eu pretium ante pulvinar. Pellentesque nec accumsan nulla, at iaculis sem.
                                    Vestibulum iaculis molestie risus, vitae sodales tellus accumsan ut. Cras fringilla pellentesque augue 
                                    rutrum pharetra.</p>

                                <p>In id imperdiet lectus, sit amet sodales arcu. Quisque id velit interdum turpis egestas tincidunt nec 
                                    eleifend nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
                                    Vestibulum elit nisi, laoreet in rhoncus nec, cursus pellentesque ex. Nulla facilisi. Morbi eget lorem 
                                    id ante vulputate sagittis. Phasellus porta, diam vitae vulputate porttitor, leo est gravida diam, quis 
                                    condimentum libero dolor ac orci. In aliquet ullamcorper hendrerit. Maecenas eu ultrices neque. Nunc vel 
                                    congue nisi.</p>

                                <p>Nunc ultrices varius nibh. Cras ut sapien ut est pellentesque dictum. Aenean sit amet enim sit amet elit 
                                    consectetur tempor. Cras congue congue lorem vitae pretium. Aliquam in convallis nisl, in dictum felis. 
                                    Nam ornare magna justo, at sagittis leo bibendum rhoncus. Cras venenatis, magna sit amet euismod luctus, 
                                    turpis ligula mattis tortor, vestibulum accumsan nibh est nec ante. Duis porta orci vitae leo facilisis 
                                    aliquet. Maecenas facilisis sapien nec mollis facilisis. Cras consequat turpis in erat iaculis, vitae 
                                    porttitor ante tempor. In mollis sapien quis faucibus tristique. Nunc non ligula porta, consequat est 
                                    nec, bibendum velit. Sed at porttitor erat, at sollicitudin nunc. Aliquam erat volutpat. Phasellus cursus 
                                    purus sit amet mauris venenatis, eget fermentum lorem feugiat. Sed non laoreet tortor.</p>

                                <p>Nam eros eros, aliquam eget sollicitudin in, commodo eget lectus. Donec varius sem enim, nec placerat ex 
                                    malesuada vitae. Ut ac felis auctor, tincidunt felis eu, hendrerit quam. Aenean nec viverra leo. Nullam 
                                    iaculis hendrerit nisi sit amet gravida. Duis imperdiet sollicitudin tellus, ut pretium eros luctus non. 
                                    Vestibulum sit amet diam ac quam viverra cursus ac id ligula. Fusce semper magna vel sapien laoreet 
                                    sagittis.</p>
                            </div>
                        </Paper>
                    </CardText>
                </Card>
            </div>
        );
    }

}
