// import helpers
import test from 'tape';

// import app
import App from '../src/app.jsx';

test('App suite', function(it) {
    it.test('# should render', function(t) {
        // render
        App.start();
        // verify it exists
        t.equal(1, document.getElementById('mainContainer').children.length);
        t.end();
    });
});
