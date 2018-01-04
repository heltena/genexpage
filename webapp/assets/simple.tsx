import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppSimple } from "./simple/AppSimple";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
	<div>
		<MuiThemeProvider>
			<div>
				<AppSimple />
			</div>
		</MuiThemeProvider>
	</div>,
	document.getElementById("react-app")
);
