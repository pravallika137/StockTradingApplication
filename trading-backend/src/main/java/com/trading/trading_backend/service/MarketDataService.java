package com.trading.trading_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class MarketDataService {

    private final RestTemplate restTemplate;

    @Value("${finnhub.api.key}")
    private String API_KEY;

    public MarketDataService() {
        this.restTemplate = new RestTemplate();
    }

    public BigDecimal getLivePrice(String symbol) {

        try {

            String url = "https://finnhub.io/api/v1/quote?symbol="
                    + symbol.toUpperCase()
                    + "&token=" + API_KEY;

            Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);

            if (response == null) {
                throw new RuntimeException("No response from API");
            }

            Object currentPrice = response.get("c");

            if (currentPrice == null) {
                throw new RuntimeException("Invalid symbol");
            }

            BigDecimal price = new BigDecimal(currentPrice.toString());

            // 🚨 Finnhub returns 0 for invalid symbol
            if (price.compareTo(BigDecimal.ZERO) <= 0) {
                throw new RuntimeException("Invalid stock symbol");
            }

            return price;

        } catch (Exception e) {
            throw new RuntimeException("Live price fetch failed");
        }
    }
    public Map<String, Object> getHistoricalData(String symbol) {

        String formattedSymbol = symbol.toUpperCase();

        long to = System.currentTimeMillis() / 1000;
        long from = to - (60L * 60 * 24 * 30);

        String url = "https://finnhub.io/api/v1/stock/candle"
                + "?symbol=" + formattedSymbol
                + "&resolution=D"
                + "&from=" + from
                + "&to=" + to
                + "&token=" + API_KEY;

        System.out.println("Calling URL: " + url);

        try {
            Map<String, Object> response =
                    restTemplate.getForObject(url, Map.class);

            System.out.println("FULL RESPONSE: " + response);

            return response;

        } catch (Exception e) {
            e.printStackTrace();   // 🔥 THIS IS IMPORTANT
            throw e;               // DO NOT hide the error
        }
    }
}