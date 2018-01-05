import * as React from "react";
import * as ReactDOM from "react-dom";

import { AppGerman } from "./german/AppGerman";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDOM.render(
	<div>
		<MuiThemeProvider>
			<div>
				<AppGerman />
			</div>
		</MuiThemeProvider>
	</div>,
	document.getElementById("react-app")
);
