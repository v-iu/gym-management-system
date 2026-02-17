  <?php

class App{
    protected $controller = 'Home'; //default controller
    protected $method = 'index'; //default method
    protected $params = []; //args/url parameters

    public function __construct(){
        $url = $this->parseURL();
        //localhost/controller/method
    //Check Controller
        if (isset($url[0]) && file_exists('../backend/controllers/' . ucfirst($url[0]) . '.php')) {
            $this->controller = ucfirst($url[0]);
            unset($url[0]);
        }

        require_once '../backend/controllers/' . $this->controller . '.php';
        $this->controller = new $this->controller;

    //Check Method
        if(isset($url[1]) && !empty($url[1])){
            if(method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            }
        }

    //Get Parameters
        $this->params = $url ? array_values($url) : [];

    //Call methods
        call_user_func_array([$this->controller, $this->method], $this->params);
    }

    public function parseURL() {
        if(isset($_GET['url'])){
            //sanitize
            return explode('/', filter_var($_GET['url'], FILTER_SANITIZE_URL));
        }
        return false;
    }
}