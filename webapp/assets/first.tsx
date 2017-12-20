import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppFirst } from "./first/AppFirst";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
	<div>
		<MuiThemeProvider>
			<div>
				<AppFirst />
			</div>
		</MuiThemeProvider>
	</div>,
	document.getElementById("react-app")
);
