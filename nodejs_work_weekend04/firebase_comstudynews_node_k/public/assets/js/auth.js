var firebaseConfig = {
    apiKey: "AIzaSyDwW0UxnQTDTTy3es3FYNFQ2Ey_miYL-Uw",
    authDomain: "node-k.firebaseapp.com",
    databaseURL: "https://node-k.firebaseio.com",
    projectId: "node-k",
    storageBucket: "node-k.appspot.com",
    messagingSenderId: "907502097068",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            // ...
            console.log('로그인 됨 >>> ', email);
            //location.href = '이동 할 경로';
        } else {
            // User is signed out.
            // ...

            console.log('아직 로그인 전 ....');
        }
    });


    //init DateTimePickers
    materialKit.initFormExtendedDatetimepickers();

    // Sliders Init
    materialKit.initSliders();
});


function login() {
    //alert('login 호출!' + $('#txtemail').val() + "," + $('#txtpasswd').val());
    var email = $('#txtemail').val();
    var password = $('#txtpasswd').val();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });
}


function scrollToDownload() {
    if ($('.section-download').length != 0) {
        $("html, body").animate({
            scrollTop: $('.section-download').offset().top
        }, 1000);
    }
}
