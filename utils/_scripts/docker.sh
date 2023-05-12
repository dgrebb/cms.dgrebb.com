#!/bin/bash
source $directory/_scripts/functions.sh

region=$(pass aws/region)

env() {
    if [ $# -eq 0 ] || [ $1 = p ]; then
        setEnv p
        image_name=$(pass dg/cms/domain)
    elif [ $1 = s ]; then
        setEnv s
        image_name=$(pass dg/cms/stg-domain)
        acr_uri=$(pass dg/cms/stg-acr-uri)
    else
        setEnv $1
        image_name=$(pass dg/cms/local-domain)
    fi
}

if [ $# -eq 0 ]; then
    printDgErr "Missing args!"
else
    while test "$1" != --; do
        cd $directory/../strapi
        case $1 in
        b | build)
            printDgMsg "Building Docker image..."
            env $2
            docker buildx build --platform linux/amd64 \
                -t ${image_name} ../strapi/.
            break 2
            ;;
        rb | rebuild)
            printDgMsg "Reuilding Docker image..."
            env $2
            docker buildx build --platform linux/amd64 \
                --no-cache \
                -t ${image_name} ../strapi/.
            break 2
            ;;
        r | run)
            printDgMsg "Running local Docker image..."
            docker run -p 1337:1337 -it $(pass dg/cms/local-domain)
            break 2
            ;;
        p | push)
            printDgMsg "Building Docker image..."
            env $2
            aws ecr get-login-password --region ${region} |
                docker login --username AWS --password-stdin ${acr_uri}
            archive
            tag
            docker push ${acr_uri}
            break 2
            ;;
        *)
            printDgErr "Unexpected options for docker: wrong docker args."
            break 2
            ;;
        esac
    done
    [ -f $directory/../strapi/.env ] && shredEnv
fi
