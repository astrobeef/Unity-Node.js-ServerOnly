(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{138:function(e,a,t){e.exports=t(568)},143:function(e,a,t){},56:function(e,a){},560:function(e,a){},563:function(e,a,t){},568:function(e,a,t){"use strict";t.r(a);var n=t(1),l=t.n(n),r=t(126),o=t.n(r),c=(t(143),t(47)),s=t(127),i=t(29),m=t(17),u=t(25),d=t(27),h=t(133),p=t.n(h);t(563);var g=function(e){return l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},l.a.createElement("button",{type:"button",className:"btn btn-primary",onClick:e.signOut},l.a.createElement("h2",{className:"m-2"},"Sign Out"))))};var E=function(e){return Object(n.useEffect)((function(){}),[]),l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},e.isLoggedIn?l.a.createElement(m.b,{to:"/about"},"About"):e.isRegistered?l.a.createElement("div",null,l.a.createElement("h1",{className:"header-light"}," Welcome back!"),l.a.createElement("form",null,l.a.createElement("div",{className:"form-group"},l.a.createElement("label",{htmlFor:"username",className:"header-light"},"Username"),l.a.createElement("input",{type:"username",className:"form-control",id:"username","aria-describedby":"usernameHelp",placeholder:"Enter username",name:"username",onChange:e.handleInputChange})),l.a.createElement("div",{className:"form-group"},l.a.createElement("label",{htmlFor:"password",className:"header-light"},"Password"),l.a.createElement("input",{type:"password",className:"form-control",id:"password",placeholder:"Password",name:"password",onChange:e.handleInputChange})),l.a.createElement("button",{type:"submit",value:"Submit",className:"btn btn-primary",onClick:e.signIn},l.a.createElement("h2",null,"Sign in")))):l.a.createElement("div",null,l.a.createElement("h1",null," Greetings Newcomer"),"Refresh the page once you've signed up.  This is a bug I haven't fixed yet.",l.a.createElement("br",null),l.a.createElement("button",{type:"submit",value:"Submit",className:"my-3 btn btn-primary",onClick:e.signIn},"Sign up"))))};var f=function(e){var a="/assets/game-builds/"+e.build+".zip";return l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},e.hasDownloaded?l.a.createElement("div",null,l.a.createElement("h1",null,"You've downloaded the game!"),l.a.createElement("h5",{className:"my-3"},"If you can't find the download in your downloads folder, press the button below"),l.a.createElement("button",{onClick:e.handleDownloadLost,type:"button",className:"btn btn-warning my-4"},"Lost Download")):l.a.createElement("div",null,l.a.createElement("h1",null,"Download Instructions"),l.a.createElement("h5",null,"If you don't have software to open ZIP files, follow the WinRAR link below."),l.a.createElement("h5",null,"Once you've downloaded the ZIP file, open the file and run the 'launch.exe' file to play."),l.a.createElement("h4",{className:"mt-4"},"WinRAR 'trial' download"),l.a.createElement("a",{className:"winRAR",href:"https://www.rarlab.com/rar/winrar-x64-580.exe"}," Windows "),l.a.createElement("a",{className:"winRAR",href:"https://www.rarlab.com/rar/rarosx-5.8.0.tar.gz"}," Mac "),l.a.createElement("h4",{className:"mt-5 mb-2"},"Download my Game!"),l.a.createElement("button",{for:"download-link",type:"button",className:"btn btn-primary m-3"},l.a.createElement(m.b,{id:"download-link",onClick:e.handleDownload,to:a,target:"_blank",download:!0},l.a.createElement("h3",null,"Download"))))))};var b=function(e){return Object(n.useEffect)((function(){e.DB_getPlayers(),console.log("Using data effect")}),[]),l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},l.a.createElement("h1",null,"Data"),l.a.createElement("h3",null,"Connected Players"),e.players?function(e){var a=e.players;return l.a.createElement("div",null,a.map((function(e){return e.key=Math.random(),l.a.createElement("div",null,l.a.createElement("h3",null,e.username),l.a.createElement("p",null,e.connection_id))})))}(e):l.a.createElement("p",null,"No players connected")))};var w=function(e){return l.a.createElement("div",{className:"App"},l.a.createElement("header",{className:"App-header"},l.a.createElement("h1",null,"About Me"),l.a.createElement("h3",null,"I'm Brian Graf")))};var v=function(e){return console.log(e),e.isLoggedIn?l.a.createElement("ul",{className:"nav justify-content-center pt-2"},e.isLoggedIn?null:l.a.createElement("li",{className:"nav-item"},l.a.createElement(m.b,{to:"/login",className:"nav-link"},l.a.createElement("h3",null,"Login/Register"))),l.a.createElement("li",{className:"nav-item"},l.a.createElement(m.b,{to:"/play",className:"nav-link"},l.a.createElement("h3",null,"Download"))),l.a.createElement("li",{className:"nav-item"},l.a.createElement(m.b,{to:"/data",className:"nav-link"},l.a.createElement("h3",null,"Data"))),l.a.createElement("li",{className:"nav-item"},l.a.createElement(m.b,{to:"/about",className:"nav-link"},l.a.createElement("h3",null,"About"))),l.a.createElement("li",{className:"nav-item"},l.a.createElement(m.b,{to:"/home",className:"nav-link"},l.a.createElement("h3",null,"Sign Out")))):null},y={getPlayers:function(){return fetch("api/players").then((function(e){if(200!==e.status){console.error("problem found with status code : ".concat(e.status)),console.warn("Returning dummy response");return[{_id:"12345abc_dummy",connection_id:"D5e315_dummy",username:"Dummy Player",connected:!0,__v:0,key:.333334}]}return e.json().then((function(e){return e}))})).catch((function(e){console.log("fetch error : ".concat(e))}))}},N="Buildv1.3-Heroku";var O=function(){var e=Object(n.useState)([]),a=Object(i.a)(e,2),t=a[0],r=a[1],o=Object(n.useState)(!1),h=Object(i.a)(o,2),O=h[0],I=h[1],_=Object(n.useState)([]),j=Object(i.a)(_,2),k=j[0],S=j[1],D=Object(n.useState)({name:"login"}),A=Object(i.a)(D,2),R=A[0],C=A[1],x=Object(n.useState)(!1),P=Object(i.a)(x,2),L=P[0],W=P[1],B=Object(n.useState)({active:!1,response:!1,endpoint:"ws://127.0.0.1:52300/socket.io/?EIO=4&transport=websocket"}),U=Object(i.a)(B,2),G=U[0],M=U[1];return Object(n.useEffect)((function(){if(console.log("Using effect"),d.a.currentAuthenticatedUser().then((function(e){!0!==t&&r(!0),!0!==O&&q(e.username)})).catch((function(e){console.log(e),!1!==t&&r(!1),!0!==O&&(localStorage.getItem("registered")?I(!0):I(!1))})),localStorage.getItem("hasDownloaded")?W(!0):!1!==L&&W(!1),!G.active){M({active:!0});var e=G.endpoint;p()(e);console.log("We are trying to connect to server with Socket.io")}}),[]),l.a.createElement("div",null,l.a.createElement(m.a,null,l.a.createElement(v,{isLoggedIn:!!t}),l.a.createElement(u.b,{exact:!0,path:"/login",render:function(e){return l.a.createElement(E,Object.assign({},e,{isRegistered:!!O,signIn:H,handleInputChange:z,isLoggedIn:t}))}}),l.a.createElement(u.b,{exact:!0,path:"/home",render:function(e){return l.a.createElement(g,Object.assign({},e,{signOut:Z}))}}),l.a.createElement(u.b,{exact:!0,path:"/play",render:function(e){return l.a.createElement(f,Object.assign({},e,{handleDownload:J,handleDownloadLost:F,hasDownloaded:L,build:N}))}}),l.a.createElement(u.b,{exact:!0,path:"/data",render:function(e){return l.a.createElement(b,Object.assign({},e,{players:k,DB_getPlayers:T}))}}),l.a.createElement(u.b,{exact:!0,path:"/about",render:function(e){return l.a.createElement(w,e)}}),l.a.createElement(u.b,{path:"/*",render:function(e){if(!t)return l.a.createElement(u.a,{to:"/login"})}})));function T(){y.getPlayers().then((function(e){console.log(e),S(e)})).catch((function(e){console.log(e)}))}function z(e){var a=e.target,t=a.value,n=a.name;C(Object(s.a)({},R,Object(c.a)({},n,t)))}function J(e){localStorage.setItem("hasDownloaded",!0),!0!==L&&W(!0)}function F(e){localStorage.removeItem("hasDownloaded"),!1!==L&&W(!1)}function H(e){if(e.preventDefault(),O){if(R&&R.username&&R.password){var a=R.username,t=R.password;d.a.signIn(a,t).then((function(e){q(a),r(!0)})).catch((function(e){console.log(e)}))}}else d.a.federatedSignIn()}function Z(){d.a.signOut().then((function(e){r(!1)})).catch((function(e){return console.log(e)}))}function q(e){localStorage.setItem("registered",e),I(!0)}},I={aws_project_region:"us-west-2",aws_cognito_identity_pool_id:"us-west-2:86736dd0-37e3-40b1-855c-74b662e25a2b",aws_cognito_region:"us-west-2",aws_user_pools_id:"us-west-2_NMn2yeWJ4",aws_user_pools_web_client_id:"58loi7nseg85g322jcphun0ql9",oauth:{domain:"unitynodeauth8acddaf0-8acddaf0-local.auth.us-west-2.amazoncognito.com",scope:["phone","email","openid","profile","aws.cognito.signin.user.admin"],redirectSignIn:"http://localhost:3000/",redirectSignOut:"http://localhost:3000/",responseType:"code"},federationTarget:"COGNITO_USER_POOLS"};d.b.configure(I),o.a.render(l.a.createElement(O,null),document.getElementById("root"))}},[[138,1,2]]]);
//# sourceMappingURL=main.aa7731a6.chunk.js.map