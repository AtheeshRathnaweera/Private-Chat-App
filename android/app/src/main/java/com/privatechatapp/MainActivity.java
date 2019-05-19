package com.privatechatapp;


import com.facebook.react.ReactActivity;



public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
      @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.launch_screen.xml);
    }

    @Override
    protected String getMainComponentName() {
        return "privateChatApp";
    }
}
