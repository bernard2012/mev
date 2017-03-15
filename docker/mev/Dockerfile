FROM cccb/mev-web:baylie-2017-02-27g

RUN R -e "install.packages (c ('Rtsne'));"

ADD mev.war /usr/local/tomcat/webapps/ROOT.war
