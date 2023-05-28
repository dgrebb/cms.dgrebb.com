red="31"
yellow="33"
bluebg="\e[44m"
BOLDRED="\e[1;${red}m"
BOLDYELLOW="\e[1;${yellow}m"
NC="\033[0m" # No Color

hello() {
    $directory/_scripts/hello.sh
}

env() {
    cd $directory/../strapi
    if [ $# -eq 0 ] || [ $1 = p ]; then
        setEnv p
        img p
    elif [ $1 = s ]; then
        setEnv s
        img s
    else
        setEnv $1
        img
    fi
}

img() {
    if [ $# -eq 0 ] || [ $1 = p ]; then
        strapi_img=$(pass dg/cms/domain)
        strapi_ecr_uri=$(pass dg/cms/ecr-uri)
    elif [ $1 = s ]; then
        strapi_img=$(pass dg/cms/s/domain)
        strapi_ecr_uri=$(pass dg/cms/s/ecr-uri)
    else
        strapi_img=$(pass dg/cms/local-domain)
    fi
}

fimg() {
    cd $directory/../front
    if [ $# -eq 0 ] || [ $1 = p ]; then
        front_img=$(pass dg/www/domain)
        front_ecr_uri=$(pass dg/www/ecr-uri)
    elif [ $1 = s ]; then
        front_img=$(pass dg/www/s/domain)
        front_ecr_uri=$(pass dg/www/s/ecr-uri)
    else
        front_img=$(pass dg/www/l/domain)
    fi
}

setEnv() {
    printDgMsg "Setting Strapi .env..."
    /bin/bash $directory/_scripts/set-env.sh $1
}

shredEnv() {
    if [ -f $directory/../strapi/.env ]; then
        printDgMsg "Shredding Strapi .env..."
        gshred $directory/../strapi/.env && rm $directory/../strapi/.env
    fi
    if [ -f $directory/../front/.env ]; then
        printDgMsg "Shredding Next .env..."
        gshred $directory/../front/.env && rm $directory/../front/.env
    fi
    if [ -f $directory/../_docker/.env ]; then
        printDgMsg "Shredding Docker .env..."
        gshred $directory/../_docker/.env && rm $directory/../_docker/.env
    fi
}

setTfEnv() {
    printDgMsg "Setting Terraform vars..."
    source $directory/../_tf/_scripts/set-tf-vars.sh
}

prepBuild() {
    /bin/bash $directory/_scripts/prep-build.sh $1
}

retag() {
    MANIFEST=$(aws ecr batch-get-image --region $(pass dg/aws/region) --repository-name ${1} --image-ids imageTag=latest --output json | jq --raw-output --join-output '.images[0].imageManifest')
    aws ecr put-image --region $(pass dg/aws/region) --repository-name $1 --image-tag last --image-manifest "${MANIFEST}" > /dev/null
    aws ecr batch-delete-image --region $(pass dg/aws/region) --repository-name $1 --image-ids --image-tag latest > /dev/null
}

archive() {
    retag $1
    docker rmi --force $1
}

tag() {
    date=$(date +%y.%m.%d-%H.%M.%S)
    docker tag $1:latest $2:latest
    docker tag $1:latest $1:$date 
    docker tag $2:latest $1:$date
}

run() {
    docker run -p 1337:1337 -it ${image_name}
}

cdcms() {
    cd ${directory}/../strapi
}

cdfront() {
    cd ${directory}/../front
}

printDg() {
    printf "\n${1}\n"
}

printDgErr() {
    printDg "${BOLDRED}${1}${NC}"
}

printDgMsg() {
    printDg "${BOLDYELLOW}${1}${NC}"
}

printDgBnr() {
    printDg "${bluebg}${BOLDYELLOW}${1}${NC}"
}