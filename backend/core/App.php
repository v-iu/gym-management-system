  <?php

class App{
    protected $controller = 'Members'; //default controller
    protected $method = 'index'; //default method
    protected $params = []; //args/url parameters

    public function __construct(){
        $url = $this->parseURL();
        $controllersPath = __DIR__ . '/../controllers/';
        //localhost/controller/method
    //Check Controller
        if (isset($url[0]) && !empty($url[0])) {
            $requestedController = ucfirst($url[0]);

            if (!file_exists($controllersPath . $requestedController . '.php')) {
                $this->respondError(404, 'Controller not found');
                return;
            }

            $this->controller = $requestedController;
            unset($url[0]);
        }

        $controllerFile = $controllersPath . $this->controller . '.php';
        if (!file_exists($controllerFile)) {
            $this->respondError(404, 'Controller not found');
            return;
        }

        require_once $controllerFile;
        if (!class_exists($this->controller)) {
            $this->respondError(500, 'Controller class not found');
            return;
        }

        $this->controller = new $this->controller;

    //Check Method
        if(isset($url[1]) && !empty($url[1])){
            if(method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            } else {
                $this->respondError(404, 'Method not found');
                return;
            }
        } elseif (!method_exists($this->controller, $this->method)) {
            $this->respondError(404, 'Method not found');
            return;
        }

    //Get Parameters
        $this->params = $url ? array_values($url) : [];

    //Call methods
        try {
            call_user_func_array([$this->controller, $this->method], $this->params);
        } catch (Throwable $e) {
            $this->respondError(500, 'An unexpected server error occurred');
        }
    }

    public function parseURL() {
        if(isset($_GET['url'])){
            //sanitize
            return explode('/', filter_var($_GET['url'], FILTER_SANITIZE_URL));
        }
        return [];
    }

    private function respondError($statusCode, $message) {
        http_response_code($statusCode);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }
}