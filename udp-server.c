#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <time.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
 
extern int mkaddr(void* addr, int* addrlen, char* str_addr, char* protocol);
 
#define MAXQ 4
 
static struct {
	char* index;
	int start;
	int volit;
	int current;
} quotes[] = {
	{ "DJIA", 1030330, 375 },
	{ "NASDAQ", 276175, 125 },
	{ "S&P 500", 128331, 50 },
	{ "TSE 300", 689572, 75 },
};
 
static void initialize() {
	time_t td;
	time(&td);
	srand((int)td);
	short x;
	for(x=0; x < MAXQ; ++x )
	quotes[x].current = quotes[x].start;
}
 
/*
 * Randomly change one index quotation:
 */
static void gen_quote() {
	short x = rand() % MAXQ;
	short v = quotes[x].volit;
	short h = (v / 2) - 2;
	short r = rand() % v;
	if(r < h) r = -r;
	quotes[x].current += r;
}
 
static void displayError(const char* on_what) {
	printf("%s: (%d)%s\n", on_what, errno, strerror(errno));
	exit(1);
}
 
int main(int argc,char** argv) {
	struct sockaddr_in srvAddr = {
		.sin_family = AF_INET,
		.sin_port = htons(67),
		.sin_addr = inet_addr("10.1.4.1")
	};
	struct sockaddr_in listenAddr = {
		.sin_family = AF_INET,
		.sin_port = htons(67),
		.sin_addr = inet_addr("0.0.0.0")
	};
	struct sockaddr_in bcAddr = {
		.sin_family = AF_INET,
		.sin_port = htons(68),
		.sin_addr = inet_addr("10.1.4.255")	
	};
	 
	int s = socket(AF_INET, SOCK_DGRAM, 0);
	if(s == -1) displayError("socket()");
	 
	int so_broadcast = 1;
	if(setsockopt(s, SOL_SOCKET, SO_BROADCAST, &so_broadcast, sizeof so_broadcast) == -1) displayError("setsockopt(SO_BROADCAST)");

	int r = bind(s, (struct sockaddr*)&listenAddr, sizeof(listenAddr));
	if(r == -1) displayError("bind()");
	 
	for(;;) {
		char buffer[512];
		int r = read(s, buffer, 512);
		printf("Got %d bytes\n", r);


/*
		int r = sendto(s, bcbuf, strlen(bcbuf), 0, (struct sockaddr*)&bcAddr, sizeof(bcAddr)); 
		if(r == -1) displayError("sendto()");

		sleep(4);*/
	}
	 
	return 0;
}

