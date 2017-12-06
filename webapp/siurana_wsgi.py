import os
import sys
import site

site.addsitedir("/var/www/virtualenvs/genexpage/lib/python3.4/site-packages")
sys.path.append("/var/www/genexpage/webapp")

from distutils.sysconfig import get_python_lib
print("************** {}".format(get_python_lib()))


os.environ["DJANGO_SETTINGS_MODULE"] = "genexpage.settings"

activate_env = os.path.expanduser("/var/www/virtualenvs/genexpage/bin/activate_this.py")
exec(compile(open(activate_env, "rb").read(), activate_env, 'exec'), dict(__file__=activate_env))

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
