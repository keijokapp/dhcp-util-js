#include <stdio.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <errno.h>
#include <string.h>




int main(int argc, const char* const argv) {
	
	struct sockaddr_in bindAddr = {
		.sin_family = AF_INET,
		.sin_addr = inet_addr("0.0.0.0"),
		.sin_port = 44443
	};
	
	int sock = socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP);
	
	if(bind(sock, (struct sockaddr*)&bindAddr, sizeof(bindAddr)) != 0) { printf("bind(): (%d)%s\n", errno, strerror(errno)); }
	
	while(1) {
		char d[1024];
		int r = read(sock, d, 1024);
		printf("Read %d bytes\n", r);
		
		break;		
		struct sockaddr_in clientAddr;
		int client = accept(sock, NULL, NULL);
		if(client < 0) { printf("accept(): (%d)%s", errno, strerror(errno)); }
		printf("accepted\n");
	}
	
}
